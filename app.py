from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a real secret key in production

# Simulate a logged-in user by default
DEFAULT_USER = "admin"

@app.route('/')
def home():
    # Automatically set the user as logged in
    session['username'] = DEFAULT_USER
    return redirect(url_for('homepage'))

@app.route('/homepage')
def homepage():
    # No need to check for session since we're automatically logged in
    return render_template('homepage.html', username=DEFAULT_USER)

@app.route('/dashboard')
def dashboard():
    # No login check needed
    
    vessel_id = request.args.get('vessel_id', '1')  # Default to vessel 1
    vessel_name = get_vessel_name(vessel_id)  # Helper function
    
    return render_template(
        'index.html',
        vessel_id=vessel_id,
        vessel_name=vessel_name,
        username=DEFAULT_USER
    )

@app.route('/logout')
def logout():
    session.pop('username', None)
    # After logout, redirect back to homepage which will auto-login again
    return redirect(url_for('homepage'))

@app.route('/api/data')
def get_sensor_data():
    # No authorization check needed
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
