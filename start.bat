@ECHO OFF
cd Client
START startnoncorsbrowser.bat
cd ../Server
START startserver.bat
exit