from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_from_directory
import random
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key_here')  # Use environment variable in production

# Hashed user database (for demo only - use a real database in production)
users = {
    "admin": generate_password_hash("password123")  # Hashed password
}

# Serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'static'), filename

@app.route('/')
def home():
    if 'username' in session:
        return redirect(url_for('homepage'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and check_password_hash(users[username], password):
            session['username'] = username
            return redirect(url_for('homepage'))
        error = 'Invalid username or password'
    return render_template('login.html', error=error)

@app.route('/homepage')
def homepage():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('homepage.html', username=session['username'])

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    vessel_id = request.args.get('vessel_id', '1')  # Default to vessel 1
    vessel_name = get_vessel_name(vessel_id)  # Helper function
    
    return render_template(
        'index.html',
        vessel_id=vessel_id,
        vessel_name=vessel_name,
        username=session['username']
    )

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/api/data')
def get_sensor_data():
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    vessel_id = request.args.get('vessel_id', '1')
    
    # Simulate different data for different vessels
    base_temp = 20 if vessel_id == '1' else 22
    base_passengers = 10 if vessel_id == '1' else 15
    
    return jsonify({
        "passengers": {
            "current": random.randint(base_passengers, base_passengers + 30),
            "entered": random.randint(0, 5),
            "exited": random.randint(0, 5)
        },
        "environment": {
            "temp": round(random.uniform(base_temp, base_temp + 10), 1),
            "humidity": round(random.uniform(40, 80), 1),
            "pressure": round(random.uniform(980, 1040), 1),
            "water_level": round(random.uniform(0, 5), 2)
        },
        "route": {
            "next_stop": random.choice(["Central Station", "Dock Area", "Flood Zone"]),
            "eta": random.randint(2, 15)
        },
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "vessel_id": vessel_id
    })

def get_vessel_name(vessel_id):
    """Helper function to get vessel name"""
    vessels = {
        '1': 'Ferry Alpha',
        '2': 'Ferry Beta'
    }
    return vessels.get(vessel_id, 'Unknown Vessel')

# This is required for Vercel to recognize the app
def vercel_handler(request):
    from flask import Request, Response
    with app.request_context(request.environ):
        return app.full_dispatch_request()
