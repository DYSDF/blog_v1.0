# coding=utf-8
import os

from libs.FileManage.FileStorage import FileStorage


def get_base_dirs_object():
    base_dirs_object = {
        "parent_dir": None,
        "dirs": [],
        "files": []
    }
    return base_dirs_object


def create_dir_object(li_dir=None, name=""):
    if li_dir is None:
        li_dir = []
    dir_object = {
        "name": "",
        "url": "/",
        "modified_time": None
    }
    li_dir.append(name)
    dir_object.update({
        "name": name,
        "url": "/" + "/".join(li_dir) + "/",
        "modified_time": FileStorage().modified_time(os.path.normpath("/".join(li_dir[1:])))
    })
    return dir_object


def create_file_object(li_dir=None, name=""):
    if li_dir is None:
        li_dir = []
    file_object = {
        "name": "",
        "url": "/",
        "modified_time": None
    }
    li_dir.append(name)
    file_object.update({
        "name": name,
        "url": FileStorage().url(os.path.join(*li_dir[1:])),
        "modified_time": FileStorage().modified_time(os.path.join(*li_dir[1:]))
    })
    return file_object


def get_bean_result():
    base_result = {
        # 基础部分
        'success': False,
        'error': None
    }
    return base_result
