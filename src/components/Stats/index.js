import React, { Component } from 'react'
import './style.css'
import DataDash from './DataDash';
import LatestBlocks from './LatestBlocks';
import { Grid, Row, Col } from 'react-bootstrap'

import Web3 from 'web3'
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/kak6M2Qgf7oHycGaCI2E"))

class Stats extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      block_ids: [],
      block_hashes: [],
      blocks: [],
      curr_block: null,
      hashrate: null,
    }
  }

  componentWillMount() {
    //console.log(web3.eth.accounts); - infura não funciona
    var curr_block_no = web3.eth.blockNumber;
    console.log(curr_block_no);
    this.setState({
      curr_block: curr_block_no
    });
    this.getBlocks(curr_block_no);
  }

  getBlocks(curr_block_no) {
    const block_ids = this.state.block_ids.slice();
    const block_hashes = this.state.block_hashes.slice();
    const blocks = this.state.blocks.slice();
    var max_blocks = 10;
    if (curr_block_no < max_blocks) max_blocks = curr_block_no;
    for (var i = 0; i < max_blocks; i++, curr_block_no--) {
      var currBlockObj = web3.eth.getBlock(curr_block_no, true);
      block_ids.push(currBlockObj.number);
      block_hashes.push(currBlockObj.hash);
      blocks.push(currBlockObj);
    }
    var hashrate = web3.eth.hashrate;
    var gasPrice = web3.eth.gasPrice;
    var peerCount = web3.net.peerCount;
    this.setState({
      block_ids: block_ids,
      block_hashes: block_hashes,
      blocks: blocks,
      hashrate: hashrate,
      gasPrice: gasPrice,
      peerCount: peerCount
    })
  }

  render() {
      return (
          <div className="Stats">
              <br/>
              <Grid>
                <Row className="show-grid">
                  <Col xs={6} sm={4}>
                    <DataDash data={this.state}/>
                  </Col>
                  <Col xs={12} sm={8}>
                    <LatestBlocks data={this.state}/>
                  </Col>
                </Row>

                <Row className="show-grid">

                </Row>
              </Grid>
          </div>
      );
  }
}

export default Stats;