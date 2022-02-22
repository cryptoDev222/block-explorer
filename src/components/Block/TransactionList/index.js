import React, { Component } from 'react';
import _ from 'lodash';
import { Table,TableBody,TableCell, TableHead, TableRow, Link} from '@material-ui/core';
import { web3_eth_getBlock } from '../../../web3Helpers';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  "table": {
    color: "white",
    border: '1px solid'
  },
  transactionList: {
    overflowX: 'auto'
  }
})

const StyledTableCell = withStyles((theme) => ({
  root: {
    color: "white",
    border: '1px solid',
    padding: '6px'
  }
}))(TableCell);

const StyledLink = withStyles((theme) => ({
  underlineHover: {
    fontSize: '1.25rem',
    color: '#00bc8c',
    "&:hover": {
      color: '#00bc8c55',
      cursor: 'pointer',
    }
  }
}))(Link);

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    };
  }

  async componentWillMount() {
    // Get the block hash from URL arguments (defined by Route pattern)
    await this.getTransactionListState(this.props.block);
  }

  async getTransactionListState(block) {
    var currblock = await web3_eth_getBlock(block, true);
    var currListObj = currblock.transactions;

    // Set the Component state
    this.setState({
      transactions: currListObj
    });
  }

  render() {
    var transactions = this.state.transactions;
    const { classes } = this.props;

    if (!transactions){
      return <pre>loading</pre>
    }
    var tableRows = [];
    _.each(transactions, (value, index) => {
      var txValue = 
        parseInt(transactions[index].value, 10) / 1000000000000000000;
      tableRows.push(
        <TableRow key={transactions[index].hash}>
          <StyledTableCell>
            <StyledLink href={`/tx/${transactions[index].hash}`}>
              <small>{transactions[index].hash}</small>
            </StyledLink>
          </StyledTableCell>
          <StyledTableCell>
            <StyledLink href={`/address/${transactions[index].from}`}>
              <small>{transactions[index].from}</small>
            </StyledLink>
          </StyledTableCell>
          <StyledTableCell>
            <StyledLink href={`/address/${transactions[index].to}`}>
              <small>{transactions[index].to}</small>
            </StyledLink>
          </StyledTableCell>
          <StyledTableCell>{txValue}</StyledTableCell>
        </TableRow>
      );
    });
    return (
      <div className={classes.transactionList}>
        <Table  className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Tx Hash</StyledTableCell>
              <StyledTableCell>From</StyledTableCell>
              <StyledTableCell>To</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </div>
    );
  }
}
export default withStyles(styles)(TransactionList);
