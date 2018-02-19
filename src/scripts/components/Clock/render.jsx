import React from 'react'; 

export default {
    Clock: function () {
        var now = new Date();
        var hour = now.getHours().toString();
        var minute = now.getMinutes().toString();
        var second = now.getSeconds().toString();

        hour = hour.length === 1 ? `0${hour}` : hour;
        minute = minute.length === 1 ? `0${minute}` : minute;
        second = second.length === 1 ? `0${second}` : second;

        return (
            <div data-bcn-id='clock' className="Clock">
                <span className="hour">{ hour }</span>
                <span className="separator">:</span>
                <span className="minute">{ minute }</span>
                <span className="separator">:</span>
                <span className="second">{ second }</span>
            </div>
        );
    }
};
