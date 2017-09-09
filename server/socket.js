
(function () {

    var AuthEvent = require('./events/auth');
    var AuctionEvent = require('./events/auction');

    function F (config) {
        
        var models = config.models;
        var room = config.room;
        var ns = null;

        this.run = function (server) {
            var io = require('socket.io')(server);
            ns = io.of(config.namespace);
            ns.on('connection', onConnection);
        };


        function onConnection (socket) {
    
            var authEvent = new AuthEvent({
                models: models,
                socket: socket
            });

            var auctionEvent = new AuctionEvent({
                models: models
            });

            var Auction = models.Auction;
            var Inventory = models.Inventory;

            socket.join(room);

            socket.on('disconnect', onDisconnect);
            socket.on('auth: do login by name', onLogin);
            socket.on('user: retrieve updated seller and winner data', onRetrieveUserData);
            socket.on('auction: user wish to start', onStartAuction);
            socket.on('auction: is there any auction in progress?', broadcastAuctionInProgress);
            socket.on('auction: someone place bid', onPlaceBid);


            function onDisconnect () {
                var auction = auctionEvent.getAuctionInProgress();
                if (authEvent.isCurrentUserTheSellerOf(auction)) {
                    auctionEvent.stop(auction);
                    broadcastAuctionInProgress();
                }
            }

            function onLogin (req) {
                var evt = authEvent.login(req, function (evt) {
                    socket.emit(evt.name, evt.data);
                });
            }

            function onRetrieveUserData (req) {
                var name = req;
                authEvent.retrieveUserData(name, function (evt) {
                    socket.emit('user: update seller and winner data', evt.data);
                });
            }

            function onStartAuction (req) {
                if (auctionEvent.hasAuctionInProgress()) {
                    socket.emit('auction: no auction in progress');
                    return;
                }
                var auction = Auction.create(req);
                var items = Inventory.decreaseQuantity(req.data.items, auction);
                var data = {
                    user: req.data.user,
                    auction: auction,
                    items: items
                };

                auctionEvent.start(auction);
                socket.emit('inventory: show updated inventory list', {data: data});

                broadcastAuctionInProgress();

                auctionEvent.startTimer(
                    function (timeRemaining) {
                        broadcast('auction: show the countdown', timeRemaining);
                    },
                    finishAuction
                );
            }

            function onPlaceBid (req) {
                auctionEvent.placeBid(req, function () {
                    broadcastAuctionInProgress();
                });
            }


            function broadcastAuctionInProgress () {
                broadcast('auction: started', {
                    data: auctionEvent.getAuctionInProgress()
                });
            }

            function broadcast (evt, data) {
                ns.to(room).emit(evt, data);
            }

            function finishAuction () {
                auctionEvent.finish(
                    function (data) {
                        broadcast('auction: show who is the winner', data);
                    },
                    persistAuction,
                    broadcastAuctionInProgress
                );
            }

            function persistAuction () {
                var auction = auctionEvent.getAuctionInProgress();
                auctionEvent.save(auction).then(function () {
                    auctionEvent.stop();
                    broadcast('auction: finished and have a winner', {
                        winner: auction.winner.name,
                        seller: auction.user.name
                    });
                    broadcastAuctionInProgress();
                });
            }

        }

    }

    module.exports = F;

})();
