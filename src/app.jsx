import {MPW} from "./mp";
import {h, Component} from 'preact';
import {Text} from 'preact-i18n';
import copy from 'clipboard-copy';
import {Button, LayoutGrid, Select, TextField} from 'preact-material-components';

import './index.scss';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Select/style.css';

const worker = new Worker("./work.js");

export default class App extends Component {
    state = {
        checked: 0,
        name: localStorage.getItem('name'),
        pw: '',
        site: '',
        count: 1,
        templateIndex: 6,
        result: ''
    };

    setTemplate = e => {
        this.setState({templateIndex: e.target.selectedIndex});
        this.cal();
    };

    next = e => {
        let {name, pw} = this.state;
        if (!name || !pw) {
            e.preventDefault();
            return;
        }
        worker.postMessage(this.state);
        this.setState({checked: 1});
        localStorage.setItem('name', name);
    }

    pre() {
        this.setState({checked: 0, site: '', result: ''});
    }

    cal() {
        let {mpw, site, count, templateIndex} = this.state;
        if (site && count) {
            worker.postMessage(this.state);
            worker.onmessage = e => {
                this.setState(e.data);
            }
        }
    }

    copyClick() {
        copy(this.state.result);
    }

    render() {
        return (<div className="steps">
            <input type="radio" className="pure-steps_radio" checked={!this.state.checked}/>
            <input type="radio" className="pure-steps_radio" checked={this.state.checked}/>
            <div className="pure-steps_group">
                <LayoutGrid>
                    <LayoutGrid.Inner className="pure-steps_group-step">
                        <LayoutGrid.Cell phoneCols="4">
                            <TextField
                                label={<Text id="name">Name</Text>}
                                value={this.state.name}
                                onKeyUp={e => {
                                    this.setState({name: e.target.value});
                                }}/>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="4">
                            <TextField
                                label={<Text id="mp">Master Password</Text>}
                                type="password"
                                onKeyUp={e => {
                                    this.setState({pw: e.target.value});
                                }}/>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="2" className="grid-center">
                            <Button raised ripple onClick={this.next.bind(this)}><Text id="next">Next</Text></Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>

                    <LayoutGrid.Inner className="pure-steps_group-step">
                        <LayoutGrid.Cell phoneCols="4">
                            <TextField
                                label={<Text id="site">Site Name</Text>}
                                value={this.state.site}
                                onKeyUp={e => {
                                    this.setState({site: e.target.value});
                                    this.cal();
                                }}
                            /></LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="2">
                            <TextField
                                label={<Text id="counter">Counter</Text>}
                                type="number"
                                value={this.state.count}
                                onKeyUp={e => {
                                    this.setState({count: e.target.value});
                                    this.cal();
                                }}
                            /></LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="2" align="bottom">
                            <Select hintText={<Text id="template">Template</Text>}
                                    selectedIndex={this.state.templateIndex}
                                    onChange={this.setTemplate}>
                                <Select.Item><Text id="select.phrase">phrase</Text></Select.Item>
                                <Select.Item><Text id="select.name">name</Text></Select.Item>
                                <Select.Item><Text id="select.pin">pin</Text></Select.Item>
                                <Select.Item><Text id="select.short">short</Text></Select.Item>
                                <Select.Item><Text id="select.basic">basic</Text></Select.Item>
                                <Select.Item><Text id="select.medium">medium</Text></Select.Item>
                                <Select.Item><Text id="select.long">long</Text></Select.Item>
                                <Select.Item><Text id="select.maximum">maximum</Text></Select.Item>
                            </Select>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="4"
                                         onClick={this.copyClick.bind(this)}>{this.state.result}</LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="2" className="grid-center">
                            <Button raised ripple onClick={this.pre.bind(this)}><Text
                                id="restart">Restart</Text></Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        </div>);
    }
}