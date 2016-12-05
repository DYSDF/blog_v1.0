import json
import datetime
from django.db import models


class Music(models.Model):
    url = models.CharField(max_length=120)
    picture = models.CharField(max_length=120)
    artist = models.CharField(max_length=120)
    title = models.CharField(max_length=120)
    albumtitle = models.CharField(max_length=120)
    sid = models.CharField(max_length=120)
    buidtime = models.DateField(default = datetime.datetime.now)

    def __unicode__(self):
        return u"%s" % self.title
