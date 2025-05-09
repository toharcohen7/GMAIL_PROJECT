import socket # import socket module
import sys    # import sys module


if len(sys.argv) != 2: # check if the number of arguments is not equal to 2
    sys.exit(1) # exit with error code 1

if int(sys.argv[1]) > 65535 or int(sys.argv[1]) < 1024: # check if the port number is not in the range of 1024 to 65535
    sys.exit(1) # exit with error code 1

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # create a TCP socket

dest_ip = 'localhost'           

dest_port = int(sys.argv[1])               
s.connect((dest_ip, dest_port)) 

while True: # run the loop for ever
    msg = input()
    if msg == "":
        msg = " " # if the input is empty, set it to a space
    
    s.send(bytes(msg, 'utf-8'))
    data = s.recv(4096)            
    print(data.decode('utf-8')) # decode the received data, which is in bytes, to a string

s.close() # close the socket