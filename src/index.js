import {assign} from './utils';
import {vq, sequence, parallel} from './vq';
import * as event from './event';

vq.sequence = sequence;
vq.parallel = parallel;

assign(vq, event);

module.exports = vq;
