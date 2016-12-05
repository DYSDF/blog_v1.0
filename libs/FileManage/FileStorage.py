# coding: utf-8

import StringIO
import os
import uuid

import errno
from PIL import Image
from django.core.exceptions import SuspiciousOperation
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.utils.encoding import filepath_to_uri

from siteRoot import settings


class FileStorage(FileSystemStorage):
    """
    自定义本地存储的storage类
    """

    def __init__(self, path="", url="", max_size=settings.MAX_SIZE, not_rename=False):
        super(FileStorage, self).__init__(location=os.path.normpath(settings.MEDIA_ROOT + os.path.sep + path),
                                          base_url=filepath_to_uri(os.path.normpath(settings.MEDIA_URL + os.path.sep + url)))
        self.max_size = max_size
        self.not_rename = not_rename

    @property
    def file_types(self):
        return []

    def make_name(self, name):
        """
        创建不重复名称
        如果不想重新命名就用特定前缀
        :param name:
        :return:
        """
        origin_name = os.path.basename(name)
        path = os.path.dirname(name)
        # 首先判断是否需要重命名---也就是说不想改名字的就加这个前缀
        if origin_name.startswith("not_name_") or self.not_rename:
            origin_name = origin_name.replace("not_name_", "")
            name = os.path.join(path, origin_name)
            return name
        # end---首先判断是否需要重命名
        try:
            f_name, hz = origin_name.split(".")
        except BaseException:
            f_name, hz = origin_name, ''
        if hz:
            r_name = "%s.%s" % (uuid.uuid1(), hz)
        else:
            r_name = "%s" % (uuid.uuid1())
        name = os.path.join(path, r_name)
        # end
        return name

    def _save(self, name, content):
        """
        判断上传文件类型
        """
        hz = name.split(".")[-1]
        # 类型判断
        if len(self.file_types) != 0:
            if hz.lower() not in self.file_types:
                raise SuspiciousOperation(u"不支持的文件类型，支持%s" % self.file_types)

        name = self.make_name(name)
        # 大小判断
        if content.size > self.max_size:
            raise SuspiciousOperation(u"文件大小超过限制，最大%dM" % (self.max_size / 1024 / 1024))

        return super(FileStorage, self)._save(name, content)

    def delete(self, name):
        """
        删除文件
        :param name:
        :return:
        """
        super(FileStorage, self).delete(name)

    def make_dir(self, name):
        full_path = self.path(name)
        directory = os.path.dirname(full_path)
        if not os.path.exists(directory):
            try:
                if self.directory_permissions_mode is not None:
                    # os.makedirs applies the global umask, so we reset it,
                    # for consistency with file_permissions_mode behavior.
                    old_umask = os.umask(0)
                    try:
                        os.makedirs(directory, self.directory_permissions_mode)
                    finally:
                        os.umask(old_umask)
                else:
                    os.makedirs(directory)
            except OSError as e:
                if e.errno != errno.EEXIST:
                    raise
        if not os.path.isdir(directory):
            raise IOError("%s exists and is not a directory." % directory)
        return True


# 图片存储对象
class ImageStorage(FileStorage):
    """
    实现一个ImageField的Storage
    """

    def __init__(self, path="", url="", max_size=settings.MAX_SIZE, re_size=None):
        super(ImageStorage, self).__init__(path=path,
                                           url=url,
                                           max_size=max_size)
        self.re_size = re_size

    @property
    def file_types(self):
        return ['jpg', 'jpeg', 'png', 'gif']

    # 缩略图处理
    def _make_thumb(self, content):
        w, h = content.size
        resize_w, resize_h = self.re_size
        if w > resize_w and h > resize_h:
            if resize_w and resize_h:
                if float(w) / h > float(resize_w) / resize_h:
                    delta = float(h) / resize_h
                    w = int(w / delta)
                    x = (w - resize_w) / 2
                    content.thumbnail((w, resize_h), Image.ANTIALIAS)
                    content = content.crop((x, 0, resize_w + x, resize_h))
                else:
                    delta = float(w) / resize_w
                    h = int(h / delta)
                    y = (h - resize_h) / 2
                    content.thumbnail((resize_w, h), Image.ANTIALIAS)
                    content = content.crop((0, y, resize_w, resize_h + y))
            elif resize_w:
                delta = float(w) / resize_w
                h = int(h / delta)
                content.thumbnail((resize_w, h), Image.ANTIALIAS)
            else:
                delta = float(h) / resize_h
                w = int(w / delta)
                content.thumbnail((w, resize_h), Image.ANTIALIAS)
        return content

    def _save(self, name, content):
        # 压缩处理
        if self.re_size is not None:
            image = Image.open(content)
            output = StringIO.StringIO()
            image = image.convert('RGB')
            image = self._make_thumb(image)
            image.save(output, 'JPEG')
            content = ContentFile(output.getvalue())
            output.close()
        # end
        return super(ImageStorage, self)._save(name, content)
