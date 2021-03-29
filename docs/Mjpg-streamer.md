## Mjpg-streamer setup

See installation instructions here -> [GitHub - jacksonliam/mjpg-streamer](https://github.com/jacksonliam/mjpg-streamer).

Create a script to launch mjpeg_streamer with parameters
More information here -> [mjpg-streamer input plugin: input_raspicam](https://github.com/jacksonliam/mjpg-streamer/blob/master/mjpg-streamer-experimental/plugins/input_raspicam/README.md)

```
cd /home/pi
sudo nano streamcam
```
Then paste this in nano
```
#!/bin/bash

mjpg_streamer -o "output_http.so -w /var/www/" -i "input_raspicam.so -fps 20 -x 1280 -y 720 -quality 50"
```
Ctrl+O To save  
Ctrl+X To quit

Make your bash script executable
```
sudo chmod +x streamcam
```

### Test if mjpeg_streamer works
Launch streamcam script
```
home/pi/streamcam
```
Result of CLI looks like  
```
MJPG Streamer Version: git rev: 310b29f4a94c46652b20c4b7b6e5cf24e532af39
 i: fps.............: 20
 i: resolution........: 1280 x 720
 i: camera parameters..............:

Sharpness 0, Contrast 0, Brightness 50
Saturation 0, ISO 0, Video Stabilisation No, Exposure compensation 0
Exposure Mode 'auto', AWB Mode 'auto', Image Effect 'none'
Metering Mode 'average', Colour Effect Enabled No with U = 128, V = 128
Rotation 0, hflip No, vflip No
ROI x 0.000000, y 0.000000, w 1.000000 h 1.000000
 o: www-folder-path......: /var/www/
 o: HTTP TCP port........: 8080
 o: HTTP Listen Address..: (null)
 o: username:password....: disabled
 o: commands.............: enabled
 i: Starting Camera
Encoder Buffer Size 81920
```

Go to http://your.raspi.ip:8080?action=stream  
Here there must be a streamed video

### Create streamcam.service for systemd
```
cd /home/pi
sudo nano streamcam.service
```

```
[Unit]
Description=Streamcam service
After=network.target

[Service]
ExecStart=/home/pi/streamcam
WorkingDirectory=/home/pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```
Ctrl+O To save  
Ctrl+X To quit

Move your service into /etc/systemd/system/
```
sudo mv /home/pi/streamcam.service /etc/systemd/system/
```
