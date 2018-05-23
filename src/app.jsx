import {h, Component} from 'preact';
import {MPW} from "./mp";

import {Button, LayoutGrid, Select, TextField} from 'preact-material-components';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Select/style.css';
import 'preact-material-components/TextField/style.css';

import './index.scss';

const template = ['phrase', 'name', 'pin', 'short', 'basic', 'medium', 'long', 'maximum']

export default class App extends Component {
    state = {
        checked: 0,
        name: localStorage.getItem('name'),
        pw: '',
        mpw: '',
        site: '',
        count: 1,
        templateIndex: 6,
        result: ''
    };

    setTemplate = e => {
        this.setState({templateIndex: e.target.selectedIndex});
        this.cal();
    };

    next(e) {
        let {name, pw} = this.state;
        if (!name || !pw) {
            e.preventDefault();
            return;
        }
        this.setState({checked: 1, mpw: new MPW(name, pw)});
        localStorage.setItem('name', name);
    }

    pre() {
        this.setState({checked: 0, site: '', result: ''});
    }

    cal() {
        let {mpw, site, count, templateIndex} = this.state;
        if (site && count) {
            mpw.generate(site, count, template[templateIndex - 1]).then(res => {
                this.setState({result: res});
            })
        }
    }

    render() {
        return (<div className="pure-steps">
            <input type="radio" className="pure-steps_radio" checked={!this.state.checked}/>
            <input type="radio" className="pure-steps_radio" checked={this.state.checked}/>
            <div className="pure-steps_group">
                <LayoutGrid>
                    <LayoutGrid.Inner className="pure-steps_group-step">
                        <LayoutGrid.Cell phoneCols="4">
                            <TextField
                                label="Name"
                                value={this.state.name}
                                onKeyUp={e => {
                                    this.setState({name: e.target.value});
                                }}/>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="4">
                            <TextField
                                label="Master Password"
                                type="password"
                                onKeyUp={e => {
                                    this.setState({pw: e.target.value});
                                }}/>
                        </LayoutGrid.Cell>
                        <Button raised ripple onClick={this.next.bind(this)}>Next</Button>
                    </LayoutGrid.Inner>

                    <LayoutGrid.Inner className="pure-steps_group-step">
                        <LayoutGrid.Cell phoneCols="4">
                            <TextField
                                label="Site Name"
                                value={this.state.site}
                                onKeyUp={e => {
                                    this.setState({site: e.target.value});
                                    this.cal();
                                }}
                            /></LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="2">
                            <TextField
                                label="Counter"
                                type="number"
                                value={this.state.count}
                                onKeyUp={e => {
                                    this.setState({count: e.target.value});
                                    this.cal();
                                }}
                            /></LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="2">
                            <Select hintText="Template"
                                    selectedIndex={this.state.templateIndex}
                                    onChange={this.setTemplate}>
                                <Select.Item>phrase</Select.Item>
                                <Select.Item>name</Select.Item>
                                <Select.Item>pin</Select.Item>
                                <Select.Item>short</Select.Item>
                                <Select.Item>basic</Select.Item>
                                <Select.Item>medium</Select.Item>
                                <Select.Item>long</Select.Item>
                                <Select.Item>maximum</Select.Item>
                            </Select>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="4">{this.state.result}</LayoutGrid.Cell>
                        <LayoutGrid.Cell phoneCols="4">
                            <Button raised ripple onClick={this.pre.bind(this)}>Restart</Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        </div>);
    }
}