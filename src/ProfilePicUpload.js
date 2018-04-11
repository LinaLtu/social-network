import React, { Component } from 'react';
import axios from './axios';

export default class ProfilePicUpload extends Component {
    constructor(props) {
        super(props);

        this.submitUploadImage = this.submitUploadImage.bind(this);
    }

    submitUploadImage(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append('file', e.target.files[0]);

        axios.post('/upload', formData).then(res => {
            this.props.changeImageUrl(res.data.data);
        });
    }

    render() {
        return (
            <form className="upload-form">
                <input type="file" onChange={this.submitUploadImage} />
            </form>
        );
    }
}
