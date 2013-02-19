#buffer {
  [zoom > 5][zoom <= 6]{
  line-width:0.5;
  line-color:white;
  line-dasharray:5,8;
  line-opacity:0.6;
  line-join: round;
  }
  [zoom = 7]{
  line-width:0.5;
  line-color:white;
  line-dasharray:5,8;
  line-opacity:0.8;
  line-join: round;
  ::text{
      text-name: [description];
      text-face-name: 'Verdana Italic';
      text-size: 8;
      text-allow-overlap:false;
      text-opacity: 0.8;
      text-fill:white;
      text-placement:line;
      text-spacing:500;
      }
  }  
  [zoom > 7]{
  line-width:0.5;
  line-color:white;
  line-dasharray:5,8;
  line-opacity:0.8;
  line-join: round;
  ::text{
      text-name: [description];
      text-face-name: 'Verdana Italic';
      text-size: 9;
      text-allow-overlap:false;
      text-opacity: 0.8;
      text-fill:white;
      text-placement:line;
      text-spacing:500;
      text-halo-radius:0.25;
      text-halo-fill:rgba(255,255,255,0.4);
      }
  }
}
