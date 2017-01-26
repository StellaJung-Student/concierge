import { AddHost, RemoveHost } from '../actions/types';
import * as util from './util';
import { register } from './dispatcher';

const add = {
    types: ['add-host'],
    handler: (state: AppState, action: AddHost) => {
        return {
            ...state,
            hosts: util.addEntity(state.hosts, action.host)
        }
    }
}

const remove = {
    types: ['remove-host'],
    handler: (state: AppState, action: RemoveHost) => {
        return {
            ...state,
            hosts: util.removeEntity(state, state.hosts, action.id)
        }
    }
}

register(add, remove);