#!/bin/bash

# Function to check if PM2 is running
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo "PM2 is not installed. Installing..."
        sudo npm install -g pm2
    fi
}

# Function to check application status
check_app_status() {
    echo "Checking application status..."
    pm2 status lms-vps
}

# Function to check logs
check_logs() {
    echo "Recent application logs:"
    pm2 logs lms-vps --lines 20
}

# Function to check system resources
check_resources() {
    echo "System Resources:"
    echo "CPU Usage:"
    top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'
    echo "Memory Usage:"
    free -h
    echo "Disk Usage:"
    df -h
}

# Main menu
while true; do
    echo "=== LMS VPS Monitoring ==="
    echo "1. Check Application Status"
    echo "2. View Recent Logs"
    echo "3. Check System Resources"
    echo "4. Restart Application"
    echo "5. Exit"
    echo "========================"
    read -p "Select an option (1-5): " choice

    case $choice in
        1)
            check_pm2
            check_app_status
            ;;
        2)
            check_pm2
            check_logs
            ;;
        3)
            check_resources
            ;;
        4)
            echo "Restarting application..."
            pm2 restart lms-vps
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
    
    echo
    read -p "Press Enter to continue..."
    clear
done 