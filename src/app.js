import {div, input, h} from '@cycle/dom'
import {Observable} from 'rxjs';

export function App(sources) {

    const text$ = sources.DOM
        .select('.my-input')
        .events('input')
        .map(event => event.target.value)
        .publishReplay();

    text$.connect();

    const historyRange$ = sources.DOM
        .select('.history')
        .events('input')
        .map(event => event.target.value);

    const textCount$ = text$.scan((acc) => {
        return acc + 1;
    }, 0);

    const historicText$ = Observable
        .combineLatest(historyRange$, textCount$)
        .map(range => {
            return text$.take(Math.ceil(range[1] * range[0]/100))
        })
        .switch();

    const ta$ = Observable.of('').merge(historicText$)
        .map((val) => {
        console.log('how historic', val);
        return div([
            h('textarea.my-input', {}, ''),
            h('p.my-history', {}, val),
            h('input.history', {attrs: {type: 'range'}})
        ])
    });


    const vtree$ = ta$.map((ta) => {
        return ta;
    });

    const sinks = {
        DOM: vtree$
    };
    return sinks
}
