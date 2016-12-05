# coding: utf-8

"""
Django中间件之POST控制

一、
不允许用户高频次提交
防止恶意攻击
当用户存在高频率提交时，阻止提交并返回提示
如果在时间间隔内重复提交，则按一定比例累计提交时间，当累计时间超出间隔时，禁止提交
当在时间间隔外提交时，则按比例减少提交时间

二、
权限控制，所有post请求必须要求登录状态，
如果未登录，跳转到登录界面

"""
import json
import time
from django.core.cache import cache
from django.http import HttpResponse

from libs.Domain.BaseUser import BaseUser

# 提交控制时间间隔（毫秒）
min_post_interval = 5 * 60 * 1000


class PostController(object):

    def process_request(self, request):

        if not request.user.is_authenticated() or not request.user.is_admin:

            # 获取访问者IP，以IP地址为区分用户根据
            if 'HTTP_X_FORWARDED_FOR' in request.META:
                ip = request.META['HTTP_X_FORWARDED_FOR']
            else:
                ip = request.META['REMOTE_ADDR']

            # 从缓存中获取用户数据
            user = cache.get(ip)
            if not user:
                user = BaseUser()

            # 针对POST进行请求控制
            if request.method == "POST":

                post_time_count = user.getPostTimeCount()

                current_time = int(time.time())
                last_post_time = user.getLastPostTime()

                if post_time_count > min_post_interval:

                    if current_time - last_post_time < min_post_interval:
                        post_time_count = min_post_interval
                    else:
                        post_time_count += (min_post_interval - current_time + last_post_time) * 0.05

                    user.setLastPostTime(current_time)
                    user.setPostTimeCount(int(post_time_count))
                    cache.set(ip, user)

                    msg = "提交频率太高，请" + str(post_time_count / 60000.0) + "分钟后再次提交！"
                    if request.is_ajax():
                        return HttpResponse(json.dumps({
                            "success": False,
                            "msg": msg
                        }), content_type="application/json")
                    else:
                        return HttpResponse("<script>alert('" + msg + "')</script>")

                else:

                    if current_time - last_post_time < min_post_interval:
                        post_time_count += (min_post_interval - current_time + last_post_time) * 0.1
                    else:
                        post_time_count += (min_post_interval - current_time + last_post_time) * 0.05

                    if post_time_count < 0:
                        post_time_count = 0
                    user.setLastPostTime(current_time)
                    user.setPostTimeCount(int(post_time_count))
                    cache.set(ip, user)
