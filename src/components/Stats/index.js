import React, { Component } from 'react';
import DataDash from './DataDash';
import { Grid, Row, Col } from 'react-bootstrap';
import {CircularProgress} from '@material-ui/core';

import AvgBlockTime from './AvgBlockTime';
import AvgTxCount from './AvgTxCount';
import BlockStats from './BlockStats';
import GasUse from './GasUse';
import LastBlock from './LastBlock';
import LatestBlocks from './LatestBlocks';
import LatestTransactions from './LatestTransactions';

import Constants from './../Constants';
import TimerMixin from 'react-timer-mixin'
import {
  web3_eth_getBlockNumber,
  web3_eth_getBlock,
  web3_eth_gasPrice,
} from '../../web3Helpers';

// var TimerMixin = require('react-timer-mixin');

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      curr_block: null,
      gasPrice: null,
    };
  }

  async componentWillMount() {
    var curr_block_no = await web3_eth_getBlockNumber();
    this.setState({
      curr_block: curr_block_no
    });
    await this.getBlocks(curr_block_no);
  }

  componentDidMount() {
    this.timer = TimerMixin.setInterval(async () => {
      console.log("aaaaaaa")
      var curr_block_no = await web3_eth_getBlockNumber();
      if (!this.state.blocks.length) return
      console.log("aaaaaaa1", this.state.blocks[0], curr_block_no)

      if (curr_block_no > this.state.blocks[0].number) {
        const block = await web3_eth_getBlock(curr_block_no, true);
        const gasPrice = await web3_eth_gasPrice();

        if (block) {
          this.state.blocks.pop();
          this.state.blocks.unshift(block);
        }

        this.setState({
          curr_block: curr_block_no,
          gasPrice: gasPrice,
        });
      }
    }, 3000);
  }

  componentWillUnmount() {
    TimerMixin.clearTimeout(this.timer);
  }

  async getBlocks(curr_block_no) {
    const blocks = this.state.blocks.slice();
    var max_blocks = Constants.MAX_BLOCKS;

    if (curr_block_no < max_blocks) max_blocks = curr_block_no;
    for (var i = 0; i < max_blocks; i++, curr_block_no--) {
      var currBlockObj = await web3_eth_getBlock(curr_block_no, true);
      blocks.push(currBlockObj);
    }

    const gasPrice = await web3_eth_gasPrice();

    this.setState({
      blocks: blocks,
      gasPrice: gasPrice,
    });
  }

  render() {
    if (!this.state || !this.state.blocks.length) {
      return <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <CircularProgress/>
        loading...
      </div>
      
    }
  
    return (
      <div className="Stats">
        <br />
        <Grid>
          <Row className="show-grid">
            <Col xs={6} sm={4}>
              <DataDash data={this.state} />
            </Col>
            <Col xs={6} sm={8}>
              <BlockStats data={this.state} />
              <br />
            </Col>
          </Row>

          <Row className="show-grid">
            <Col xs={4} sm={3}>
              <AvgBlockTime data={this.state} />
            </Col>
            <Col sm={4} md={3}>
              <LastBlock data={this.state} />
            </Col>
            <Col sm={4} md={3}>
              <AvgTxCount data={this.state} />
            </Col>
            <Col sm={4} md={3}>
              <GasUse data={this.state} />
            </Col>
          </Row>

          <Row className="show-grid">
            <Col xs={12} lg={6}>
              <br />
              <LatestBlocks data={this.state} />
            </Col>
            <Col xs={12} lg={6}>
              <br />
              <LatestTransactions data={this.state} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Stats;
