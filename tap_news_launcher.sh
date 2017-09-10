#!/bin/zsh
# redis-server &
# mongod &

# pip install -r requirements.txt
cd web_server/client
# npm run build &
cd ../server
npm start &

cd ../../news_topic_modeling_service/server
python server.py &

cd ../../backend_server
python service.py &

cd ../news_recommendation_service
python recommendation_service.py &
python click_log_processor.py &


echo "============================"
read -p "PRESS [ANY KEY] TO TERMINATE PROCESSES." PRESSKEY

killall node
killall python
