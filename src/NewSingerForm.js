import React from 'react';

export default class NewSingerForm extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            band: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { name, band } = this.state;
        return (
            <form>
                <input
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    placeholder="Singer name"
                />
                <input
                    onChange={this.handleChange}
                    name="band"
                    type="text"
                    placeholder="Band"
                />
                <button
                    onClick={e => {
                        e.preventDefault();
                        this.props.handleSubmit(name, band);
                    }}
                >
                    Add New Singer
                </button>
            </form>
        );
    }
}
