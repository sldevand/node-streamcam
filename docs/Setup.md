# Node StreamCam
## Setup
```
git clone https://github.com/sldevand/node-streamcam
cd /home/pi/node-streamcam
npm install
```

### Test manually if app is served on 192.168.X.X:3000
node /home/pi/node-streamcam/server.js

### Create node-streamcam.service for systemd
```
cd /home/pi
sudo nano node-streamcam.service
```

```
[Unit]
Description=Node Streamcam service
After=network.target

[Service]
ExecStart=node /home/pi/node-streamcam/server.js
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
sudo mv /home/pi/node-streamcam.service /etc/systemd/system/
```
Enable your service at boot
```
sudo systemctl enable node-streamcam.service
```
