# coding: utf-8
import time


class BaseUser:
    def __init__(self):
        self.last_post = {
            "last_post_time": time.time(),
            "post_time_count": 0
        }

    def getLastPostTime(self):
        return self.last_post.setdefault("last_post_time", time.time())

    def setLastPostTime(self, seconds):
        self.last_post.update({
            "last_post_time": seconds
        })

    def getPostTimeCount(self):
        return self.last_post.setdefault("post_time_count", 0)

    def setPostTimeCount(self, seconds):
        self.last_post.update({
            "post_time_count": seconds
        })
