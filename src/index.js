import {assign} from './utils';
import {vq, stop, sequence, parallel} from './vq';
import * as event from './event';

vq.sequence = sequence;
vq.parallel = parallel;
vq.stop = stop;

assign(vq, event);

module.exports = vq;
