import socket # import socket module
import sys    # import sys module

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