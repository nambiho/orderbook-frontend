import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const ListItemLink = props => <ListItem button component="a" {...props} />;

const Menu = ({ product, classes }) => {
  const { productName, productPrice, categoryId } = product;
  return (
    <ListItemLink href={`#${categoryId}`}>
      <ListItemText
        primary={productName}
        secondary={(
          <React.Fragment>
            <Typography component="span" className={classes.inline} color="textPrimary">
              to Scott, Alex, Jennifer
            </Typography>
            {productPrice}
원
          </React.Fragment>
)}
      />
    </ListItemLink>
  );
};

export default withStyles()(Menu);
