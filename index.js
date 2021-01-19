const sendClient = require("./client/sendClient");
const receiveClient = require("./client/receiveClient");
const net = require('net');
const { Stick, MaxBodyLen } = require('@lvgithub/stick');



const startserver = (port) => {
    const server = net.createServer(socket => {
      
    });
    server.on('connection', (socket) => {
        
        let receive;
        let stick = new Stick(1024);
        stick.setMaxBodyLen(MaxBodyLen['32K']);
    
        socket.on('data', data => {
            stick.putData(data);
        });
        socket.on('close', data => {
            receive.exit();
            socket = null;
            stick = null;
            console.log("close");
        });
        // stick 会解析好一个个数据包，按照接收的顺序输出
        stick.onBody(body => {
            console.log('body:', body.toString());
            let data = JSON.parse(body.toString());
            receive = new receiveClient("10002", data.room);
            receive.on("message", msg => {
                // msg.type表示消息类型
                // enter：进场消息、chatmsg：弹幕消息、dgb：送礼消息
                if (socket){
                    socket.write(stick.makeData(JSON.stringify(msg)));
                }
            });
            receive.on("close", msg => {
                if (socket){
                    socket.close();
                }
            });
        });
    
    });
    
    server.listen(port);
};

module.exports = {
    start: startserver
};
