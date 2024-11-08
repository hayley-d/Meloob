import React from "react";

export class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {input: ''}
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this);
    }

    handleInputChange (event) {
        this.setState({ input: event.target.value });
    }

    handleSearch () {
        const sanitizedInput = this.state.input.replace(/#/g, '').trim();
        this.props.onSearch(sanitizedInput);
    }

    cancelSearch (){
        const { onCancel } = this.props;
        this.setState({ input: '' });
        onCancel();
    }

    render() {
        return (
            <div className="container-fluid search-bar-container-large">
                <div className="search-bar">
                    <div>
                        <input className="search-bar-input" type="search" placeholder="Search" value={this.state.input} onChange={this.handleInputChange}/>
                    </div>
                    <div className="search-bar-buttons">
                        <svg onClick={this.handleSearch} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#28282f" className="search-icon bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                    </div>
                    <div className="search-bar-buttons">
                        <svg onClick={this.cancelSearch} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#28282f" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

}

