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
        .map(event => event.target.value)
        .startWith(100);

    const textCount$ = text$.scan((acc) => {
        return acc + 1;
    }, 0);

    const historicText$ = Observable
        .combineLatest(historyRange$, textCount$, (range, count) => {
            return text$.skip(Math.floor(count * range / 100) -1).take(1);
        })
        .switch()
        .do(x => console.log(x));


    const ta$ = Observable.of('').merge(historicText$)
        .map((val) => {
            return div('.main', [
                div('.form', [
                    h('textarea.my-input', {}, ''),
                    h('textarea.my-history', {attrs: {disabled: true}}, val),
                ]),
                h('input.history', {attrs: {type: 'range', value: 100}})
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
