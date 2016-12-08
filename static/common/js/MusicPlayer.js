/**
 * Created by 断崖 on 2016/12/8.
 */

define([], function () {
    function SimpleMusicPlayer() {
        this.player = new Audio();

        

    }

    if(!window.SimpleMusicPlayer) window.SimpleMusicPlayer = SimpleMusicPlayer;

    return SimpleMusicPlayer;
});