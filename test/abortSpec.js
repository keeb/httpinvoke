var cfg = require('../dummyserver-config');
var httpinvoke = require('../httpinvoke-node');

describe('abort', function() {
    this.timeout(10000);
    it('does not throw', function(done) {
        var abort = httpinvoke(cfg.url);
        try {
            abort();
            done();
        } catch(err) {
            done(err);
        }
    });
    it('ensures that no callbacks, except finished with Error, are called when invoked immediately', function(done) {
        var callback = function(callback) {
            return function() {
                if(done === null) {
                    return;
                }
                done(new Error('A ' + callback + ' callback has been called with arguments ' + [].slice.call(arguments)));
                done = null;
            }
        };
        var abort = httpinvoke(cfg.url + '#MARK', {
            gotStatus: callback('gotStatus'),
            downloading: callback('downloading'),
            uploading: callback('uploading'),
            finished: function(err) {
                if(done === null) {
                    return;
                }
                if(typeof err === 'object' && err !== null && err instanceof Error) {
                    done();
                } else {
                    done(new Error('"finished" was not called with Error'));
                }
            }
        });
        abort();
    });
});
