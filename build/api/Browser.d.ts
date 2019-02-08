/// <reference types="node" />
import EventEmitter from 'events';
import Page from './Page';
import { TSend } from './types';
declare class Browser extends EventEmitter {
    private _send;
    constructor(arg: {
        send: TSend;
    });
    close(): Promise<void>;
    disconnect(): Promise<void>;
    newPage(): Promise<Page>;
    pages(): Promise<Page[]>;
}
export default Browser;
