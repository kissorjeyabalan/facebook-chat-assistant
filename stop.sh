set -e
docker cp facebookchatassistant_chatbot_1:/app/config.yml ./config.yml
docker-compose down
