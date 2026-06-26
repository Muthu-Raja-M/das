import socket
import time
import sys

def main():
    host = "db"
    port = 5432
    print(f"Waiting for database at {host}:{port}...")
    
    start_time = time.time()
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1.0)
                s.connect((host, port))
                print("Database is ready! Continuing.")
                break
        except Exception:
            if time.time() - start_time > 60:
                print("Timeout waiting for database. Exiting.")
                sys.exit(1)
            time.sleep(1.0)

if __name__ == "__main__":
    main()
