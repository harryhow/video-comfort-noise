Video Comfort Noise
===================

###Preview URL
http://itp.nyu.edu/~chc468/v/video-comfort/index.html

###Test Procedure
1. open page and allow using your camera otherwise this app won't work
2. get or notify other client your ID.
3. let them or you call your/their ID
4. Only after your call has established, you can start to press 'face tracking' button
5. face tracking will detect your mouth open or close staus to affect the other video chatting client's frame color
 - mouth close -> same color
 - mouth open -> different color

###Tracking points smooth

        // to calculate distance between two points in terms of Y value
        var y1 = Math.abs(ay1-by1);
        var y2 = Math.abs(ay2-by2);
        var y3 = Math.abs(ay3-by3);
        
        
        // threshold of distance to differntial mouth open and close
        if ((y1>0 && y1<3) && (y2>0 && y2<3) && (y3>0 && y3<3)){
           // mouth is CLOSE
        }else if ((y1>3 && y1<7) && (y2>3 && y2<7) && (y3>3 && y3<7)){
          //mouth is OPEN
        }


###Contribution & Credit
1. Ben's visual effect, https://github.com/bdkauff/face-tracker
2. Laruen's code example, https://github.com/lmccart/everything-but-the-chat#send-data

     
