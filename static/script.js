document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initPassengerChart();
    initEnvironmentChart();
    initRouteChart();
    
    // Load initial data and set up periodic updates
    fetchDataAndUpdateUI();
    setInterval(fetchDataAndUpdateUI, 3000);
});

async function fetchDataAndUpdateUI() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        updatePassengerData(data.passengers);
        updateEnvironmentalData(data.environment);
        updateETAData(data.route);
        updateCharts(data); // Update all charts with new data
        
    } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to simulated data if API fails
        const fallbackData = {
            passengers: {
                current: Math.floor(Math.random() * 50),
                entered: Math.floor(Math.random() * 5),
                exited: Math.floor(Math.random() * 5)
            },
            environment: {
                temp: (20 + Math.random() * 10).toFixed(1),
                humidity: (40 + Math.random() * 40).toFixed(0),
                pressure: (980 + Math.random() * 60).toFixed(1),
                water_level: (Math.random() * 5).toFixed(2)
            },
            route: {
                next_stop: ["Central Station", "Dock Area", "Flood Zone"][Math.floor(Math.random() * 3)],
                eta: Math.floor(3 + Math.random() * 15)
            }
        };
        updatePassengerData(fallbackData.passengers);
        updateEnvironmentalData(fallbackData.environment);
        updateETAData(fallbackData.route);
        updateCharts(fallbackData);
    }
}

function updatePassengerData(data) {
    const capacityPercent = Math.min(100, Math.floor((data.current / 50) * 100));
    
    document.getElementById('current-passengers').textContent = data.current;
    document.getElementById('passengers-in').textContent = data.entered;
    document.getElementById('passengers-out').textContent = data.exited;
    
    const capacityFill = document.getElementById('capacity-level');
    capacityFill.style.width = `${capacityPercent}%`;
    document.getElementById('capacity-percent').textContent = `${capacityPercent}%`;
    
    // Update capacity color
    capacityFill.style.backgroundColor = 
        capacityPercent > 80 ? 'var(--danger-color)' :
        capacityPercent > 50 ? 'var(--warning-color)' :
        'var(--passenger-card)';
}

function updateEnvironmentalData(data) {
    document.getElementById('temperature').textContent = `${data.temp}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    
    if (document.getElementById('water-level')) {
        document.getElementById('water-level').textContent = `${data.water_level}m`;
    }
    
    document.getElementById('last-updated').textContent = 
        `Last updated: ${new Date().toLocaleTimeString()}`;
}

function updateETAData(data) {
    document.getElementById('eta-minutes').textContent = data.eta;
    document.getElementById('next-stop').textContent = data.next_stop;
    
    // Calculate progress
    const progressPercent = Math.min(100, Math.max(0, 
        Math.floor((data.eta / 15) * 100)  // Simple mock calculation
    ));
    
    document.getElementById('route-progress').style.width = `${progressPercent}%`;
    document.getElementById('progress-percent').textContent = `${progressPercent}%`;
}

// Chart functions
let passengerChart, environmentChart, routeChart;

function initPassengerChart() {
    const ctx = document.getElementById('passengerChart').getContext('2d');
    passengerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(24).fill().map((_, i) => `${i}:00`),
            datasets: [{
                label: 'Passenger Count',
                data: Array(24).fill().map(() => Math.floor(Math.random() * 50)),
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Passenger Count History'
                }
            }
        }
    });
}

function initEnvironmentChart() {
    const ctx = document.getElementById('environmentChart').getContext('2d');
    environmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(24).fill().map((_, i) => `${i}:00`),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: Array(24).fill().map(() => (20 + Math.random() * 10).toFixed(1)),
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Humidity (%)',
                    data: Array(24).fill().map(() => (40 + Math.random() * 40).toFixed(0)),
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Environmental Data History'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

function initRouteChart() {
    const ctx = document.getElementById('routeChart').getContext('2d');
    routeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array(24).fill().map((_, i) => `${i}:00`),
            datasets: [{
                label: 'ETA Minutes',
                data: Array(24).fill().map(() => Math.floor(3 + Math.random() * 15)),
                backgroundColor: 'rgba(155, 89, 182, 0.7)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Route ETA History'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ETA (minutes)'
                    }
                }
            }
        }
    });
}

function updateCharts(data) {
    // In a real implementation, you would update the charts with new data
    // For now, we'll just randomize to simulate updates
    if (passengerChart) {
        passengerChart.data.datasets[0].data = 
            passengerChart.data.datasets[0].data.slice(1).concat([data.passengers.current]);
        passengerChart.update();
    }
    
    if (environmentChart) {
        environmentChart.data.datasets[0].data = 
            environmentChart.data.datasets[0].data.slice(1).concat([data.environment.temp]);
        environmentChart.data.datasets[1].data = 
            environmentChart.data.datasets[1].data.slice(1).concat([data.environment.humidity]);
        environmentChart.update();
    }
    
    if (routeChart) {
        routeChart.data.datasets[0].data = 
            routeChart.data.datasets[0].data.slice(1).concat([data.route.eta]);
        routeChart.update();
    }
}