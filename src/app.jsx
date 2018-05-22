import {
    h,
    Component
} from 'preact';
import { MPW } from "./mp";

import Select from 'preact-material-components/Select';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';

import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';

import './index.scss';

const template = ['phrase', 'name', 'pin', 'short', 'basic', 'medium', 'long', 'maximum']

export default class App extends Component {
    state = {
        name: localStorage.getItem('name'),
        pw: '',
        mpw: '',
        site: '',
        count: 1,
        templateIndex: 6,
        result: ''
    };

    setTemplate = e => {
        this.setState({ templateIndex: e.target.selectedIndex });
        this.cal();
    };

    next(e) {
        let { name, pw } = this.state;
        if (!name || !pw) {
            e.preventDefault();
            return;
        }
        this.setState({ mpw: new MPW(name, pw) });
        localStorage.setItem('name', name);
    }

    pre() {
        this.setState({ site: '', result: '' });
    }

    cal() {
        let { mpw, site, count, templateIndex } = this.state;
        if (site && count) {
            mpw.generate(site, count, template[templateIndex - 1]).then(res => {
                this.setState({ result: res });
            })
        }
    }

    render() {
        return <ol>
            <li class="pure-steps_group-step">
                <TextField
                    label="Name"
                    value={this.state.name}
                    onKeyUp={e => {
                        this.setState({ name: e.target.value });
                    }}
                /> <TextField
                    label="Master Password"
                    type="password"
                    onKeyUp={e => {
                        this.setState({ pw: e.target.value });
                    }}
                />
                <label id="next" for="step-1" onClick={this.next.bind(this)}>Next</label>
            </li>
            <li class="pure-steps_group-step">
                <TextField
                    label="Site Name"
                    value={this.state.site}
                    onKeyUp={e => {
                        this.setState({ site: e.target.value });
                        this.cal();
                    }}
                />
                <TextField
                    label="Counter"
                    type="number"
                    value={this.state.count}
                    onKeyUp={e => {
                        this.setState({ count: e.target.value });
                        this.cal();
                    }}
                />
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
                <div>{this.state.result}</div>
                <label id="pre" for="step-0" onClick={this.pre.bind(this)}>Restart</label>
            </li>
        </ol>;
    }
}