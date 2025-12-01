web: cd backend && gunicorn Breath_Pacer_Backend.wsgi:application --bind 0.0.0.0:$PORT
release: cd backend && python manage.py migrate --noinput

