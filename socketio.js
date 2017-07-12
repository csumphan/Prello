var instance;

module.exports = {
    instance,
    getInstance: function(){
                    return instance;
                },
    setup: function(server){
            instance = require('socket.io')(server);

            instance.on('connection', function(socket){
                console.log('a user connected');
                // instance.emit('hello', instance.engine.clientsCount);
                socket
                .on('joinBoard', function(room){
                    socket.join(room.bid);
                })
                .on('disconnect', function(){
                    console.log('a user disconnect');
                })
                .on('msg', function(msg){
                    console.log(msg);
                })
                .on('addCard', function(card){
                    instance.in(card.bid).emit('addCard', {listID: card.listID,
                                                           cardIndex: card.cardIndex});
                })
                .on('patchTitle', function(title){
                    instance.in(title.bid).emit('patchTitle', {title: title.title,
                                                               listID: title.listID,
                                                               cardIndex: title.cardIndex});
                })
                .on('patchDesc', function(desc){
                    instance.in(desc.bid).emit('patchDesc', {desc: desc.desc,
                                                               descForm: desc.descForm,});
                })
                .on('patchDate', function(date){
                    instance.in(date.bid).emit('patchDate', {date: date.date,
                                                               listID: date.listID,
                                                               cardIndex: date.cardIndex});
                })
                .on('addLabel', function(label){
                    instance.in(label.bid).emit('addLabel', {listID: label.listID,
                                                               cardID: label.cardID,
                                                               labelClass: label.labelClass,
                                                               labelText: label.labelText});
                })
                .on('deleteLabel', function(label){
                    instance.in(label.bid).emit('deleteLabel', {miniID: label.miniID,
                                                               modalID: label.modalID,
                                                               index: label.index});
                })
                .on('deleteMem', function(mem){
                    instance.in(mem.bid).emit('deleteMem', {memForm: mem.memForm,
                                                               memIndex: mem.memIndex,});
                })
                .on('addMem', function(mem){
                    instance.in(mem.bid).emit('addMem', {memForm: mem.memForm,
                                                               memName: mem.memName,
                                                               });
                })
                .on('addComment', function(comment){
                    instance.in(comment.bid).emit('addComment', {commentForm: comment.commentForm,
                                                               commentText: comment.commentText,
                                                                userName: comment.userName,
                                                                dateTime: comment.dateTime,
                                                               });
                })
                .on('removeCard', function(card){
                    instance.in(card.bid).emit('removeCard', card.splitID);
                })
                .on('addList', function(list){
                    instance.in(list.bid).emit('addList');
                })
                .on('removeList', function(list){
                    instance.in(list.bid).emit('removeList',{index: list.index, lid: list.lid,});
                });

            });
        }
};
