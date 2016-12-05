# coding: utf-8

import StringIO
import os
import random
import unicodedata

from PIL import Image
from django.core.exceptions import SuspiciousOperation
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage

from siteRoot import settings
from siteRoot.settings import debug

if not debug:
    import sae
    import sae.storage


class SaeAndNotSaeStorage(FileSystemStorage):
    """
    这是一个支持sae和本地django的FileStorage基类
    修改存储文件的路径和基本url
    """

    def __init__(self, location=settings.MEDIA_ROOT, base_url=settings.MEDIA_URL):
        super(SaeAndNotSaeStorage, self).__init__(location, base_url)

    def get_valid_name(self, name):
        """
        这个方法用于验证文件名,我这里的处理方法是去掉中文，我没有找到支持中文名的方法，欢迎补充
        """
        # name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore')
        # 处理中文文件名sae不支持
        if not debug:
            try:
                if 1:
                    # 去掉中文
                    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore')
                else:
                    for k in name:
                        if self.is_chinese(k):
                            name = "wszw%s" % random.randint(0, 100)
            except Exception, e:
                name = "%s.jpg" % type(name)
        # end
        return super(SaeAndNotSaeStorage, self).get_valid_name(name)

    @property
    def maxsize(self):
        return 10 * 1024 * 1024  # 文件2M--sae限制只能传2M,单个文件，据说是10M,其实只有2M

    @property
    def filetypes(self):
        return []

    def makename(self, name):
        # 取一个不重复的名字，sae会把重名覆盖
        oname = os.path.basename(name)
        path = os.path.dirname(name)
        # 首先判断是否需要重命名---也就是说不想改名字的就加这个前缀
        if oname.startswith("_mine_"):
            oname = oname.replace("_mine_", "")
            name = os.path.join(path, oname)
            return name
        # end---首先判断是否需要重命名
        try:
            fname, hk = oname.split(".")
        except Exception, e:
            fname, hk = oname, ''
        if hk:
            rname = "%s_%s.%s" % (random.randint(0, 100), fname, hk)
        else:
            rname = "%s_%s" % (random.randint(0, 100), fname)
        name = os.path.join(path, rname)
        # end
        return name

    def _save(self, name, content):
        """
        可以判断上传哪些文件
        """
        hz = name.split(".")[-1]
        # 类型判断
        if self.filetypes != '*':
            if hz.lower() not in self.filetypes:
                raise SuspiciousOperation(u"不支持的文件类型,支持%s" % self.filetypes)
        # end
        name = self.makename(name)
        # 大小判断
        if content.size > self.maxsize:
            raise SuspiciousOperation(u"文件大小超过限制")
        # end
        # 保存
        if not debug:
            s = sae.storage.Client()
            if hasattr(content, '_get_file'):  # admin入口
                ob = sae.storage.Object(content._get_file().read())
            else:  # view入口（ContentFile）
                ob = sae.storage.Object(content.read())
            url = s.put('media', name, ob)  # 注意这里的media,是sae-storage上的domain名
            return name
        else:
            return super(SaeAndNotSaeStorage, self)._save(name, content)
            # end--保存

    def delete(self, name):
        """
       sae的存储空间很宝贵，所有我们在删除图片数据库记录的时候也需要删除图片
        """
        if not debug:
            s = sae.storage.Client()
            try:
                s.delete('media', name)
            except Exception, e:
                pass
        else:
            super(SaeAndNotSaeStorage, self).delete(name)


class ImageStorage(SaeAndNotSaeStorage):
    """
    实现一个ImageField的Storage
    """

    @property
    def maxsize(self):
        return 5 * 1024 * 1024  # 文件2M

    @property
    def filetypes(self):
        return ['jpg', 'jpeg', 'png', 'gif']


class FileStorage(SaeAndNotSaeStorage):
    @property
    def maxsize(self):
        return 10 * 1024 * 1024  # 文件5M

    @property
    def filetypes(self):
        return "*"

        # def makename(self, name):
        #    return name


# 缩略图处理
def make_thumb(obj, setw=None, seth=None):
    pixbuf = obj
    w, h = pixbuf.size
    if w > setw and h > seth:
        if setw and seth:
            if float(w) / h > float(setw) / seth:
                delta = float(h) / seth
                w = int(w / delta)
                x = (w - setw) / 2
                pixbuf.thumbnail((w, seth), Image.ANTIALIAS)
                pixbuf = pixbuf.crop((x, 0, setw + x, seth))
            else:
                delta = float(w) / setw
                h = int(h / delta)
                y = (h - seth) / 2
                pixbuf.thumbnail((setw, h), Image.ANTIALIAS)
                pixbuf = pixbuf.crop((0, y, setw, seth + y))
        elif setw:
            delta = float(w) / setw
            h = int(h / delta)
            pixbuf.thumbnail((setw, h), Image.ANTIALIAS)
        else:
            delta = float(h) / seth
            w = int(w / delta)
            pixbuf.thumbnail((w, seth), Image.ANTIALIAS)
    return pixbuf


class ThumbStorage(ImageStorage):
    """
    缩略图-------这个非常关键，处理后的图片在sae上怎么保存，关键就在StringIO
    """

    def __init__(self, w=None, h=None):
        self.w = w
        self.h = h
        ImageStorage.__init__(self)

    def _save(self, name, content):
        # 处理
        image = Image.open(content)

        output = StringIO.StringIO()
        image = image.convert('RGB')
        image = make_thumb(image, self.w, self.h)
        image.save(output, 'JPEG')
        f = ContentFile(output.getvalue())
        output.close()
        # end
        return super(ThumbStorage, self)._save(name, f)
