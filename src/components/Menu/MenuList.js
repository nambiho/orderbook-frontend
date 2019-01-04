import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from './Menu';

const styles = theme => ({
    root: {
        // width: '100%',
        backgroundColor: theme.palette.background.paper,
        // position: 'relative',
        overflow: 'auto',
        // '-webkit-overflow-scrolling': 'touch',

        height: '100%',

    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
        textAlign: 'left',
    },
    ListSubheader: {
        height: 48,
    },
    subheaderText: {
        marginTop: 12,
        marginBottom: 12,
        fontSize: 16,
        lineHeight: 1.5,
        letterSpacing: 0.2,
        color: 'rgba(0, 0, 0, 0.87)',
    },
});

const MenuList = ({classes, products, categories, onScroll, onClick}) => (
    <List className={classes.root} subheader={<li/>}
          dense={true}
          onScroll={(e) => onScroll(e)}>
        {categories.map(category => (
            <li key={category.categoryId} className={classes.listSection}
                id={`tab_${category.categoryId}`}>
                <ul className={classes.ul}>
                    <ListSubheader className={classes.ListSubheader}
                                   disableSticky={true}>
                  <span
                      className={classes.subheaderText}>{category.categoryName}</span>
                    </ListSubheader>
                    {products.filter(
                        item => item.categoryId === category.categoryId).
                        map(item => (
                            <Menu product={item} key={item.productId}
                                  onClick={onClick}/>
                        ))}
                </ul>
            </li>
        ))}
    </List>
);

export default withStyles(styles, {withTheme: true})(MenuList);