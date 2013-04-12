/**
 * Monitor contstructor.
 *
 * @param {Object} io the SocketIO object
 * @param {Object} bio BidIO object
 * @param {Object} options monitor options
 * @api public
 */

function Monitor(io, bio, options) {
    options = options || {};
    this.io = io;
    this.bio = bio;
    this.url = options.url || null;
    this.channels = options.channels || null;
    this.counter = 0;
    this.colors = {
        'error': 'red',
        'fetch': 'grey',
        'lock': 'cyan',
        'complete': 'green'
    };
    this.states = [
        'Active',
        'Pending',
        'Completed',
        'Inactive',
        'Unknown'
    ];
    this.connect();
}

/**
 * Version.
 *
 * @api public
 */

Monitor.prototype.version = '0.0.1';

/**
 * Connect io and bio.
 *
 * @api private
 */

Monitor.prototype.connect = function() {
    if (!this.url) {
        throw new Error('options.url is required');
    }
    if (!this.channels) {
        throw new Error('options.channels is requried');
    }
    this.bio = bio(this.io, this.url);
    this.conn = this.bio.connect();
    this.joinChannels();
};

/**
 * Join all channels.
 *
 * @return {Monitor} self
 * @api public
 */

Monitor.prototype.joinChannels = function() {
    for (var key in this.channels) {
        this.watch(this.bio.getChannel(key) || this.bio.join(key));
    }
};

/**
 * Start watching bids in a single channel.
 *
 * @param {Object} chnl the channel object
 * @return {Object} parsed data
 * @api public
 */

Monitor.prototype.watch = function(chnl) {
    var self = this;
    chnl.watch(function(data, action) {
        if (action == 'error')
            return;
        self.insertRow(self.parse(chnl.name, data, action));
    });
    return this;
};

/**
 * Parse given data to provide a valid object for monitor template.
 *
 * @param {String} key the channel key
 * @param {Object} data the data to pass to the template
 * @param {String} action the watch action
 * @return {Object} parsed data
 * @api private
 */

Monitor.prototype.parse = function(key, data, action) {
    return {
        action: action,
        chnl: this.channels[key],
        counter: this.counter,
        state: 'undefined' !== typeof data.state ? this.states[data.state] : '-',
        color: this.colors[action],
        ownerName: !!data.owner ? data.owner.name : '-',
        ownerId: !!data.owner ? data.owner.id : '-'
    };
};

/**
 * Insert the html in the table.
 *
 * @param {Object} data the data to pass to the template
 * @return {Monitor} self
 * @api private
 */

Monitor.prototype.insertRow = function(data) {
    $('#actionList tr:first').after(this.template(data));
    $('#tr' + data.counter + '').effect('highlight', {color: data.color}, 2000);
    return this;
};

/**
 * Connect io and bio.
 *
 * @param {Object} data the data to pass to the template
 * @return {String} the parsed html
 * @api private
 */

Monitor.prototype.template = function(data) {
    return ''.concat(
            '<tr id="tr' + data.counter + '">',
            '<td><span style="' + data.color + ';"> ' + data.action + ' </span></td>',
            '<td> ' + data.chnl + ' </td>',
            '<td> ' + data.state + ' </td>',
            '<td> ' + data.ownerName + ' </td>',
            '<td> ' + data.ownerId + '</td>',
            '</tr>'
            );
};

/**
 * Monitor options. 
 */

var options = {
    url: 'http://' + window.location.hostname + ':3000',
    channels: channels
};

/**
 * Lets initiate monitor here.
 */

var monitor = new Monitor(io, bio, options);

