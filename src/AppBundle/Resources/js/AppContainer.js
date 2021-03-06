"use strict";

import React from 'react';
import Swinger from "./Swinger";
import {modalResize} from './helper';

export default class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        this.updateCards = this.updateCards.bind(this);

        this.state = {
            cards: []
        };
    }

    updateCards(cards) {
        modalResize();
        this.setState({cards});
    }

    render() {
        return (
            <Swinger cards={this.state.cards} updateCards={this.updateCards}/>
        )
    }
}
