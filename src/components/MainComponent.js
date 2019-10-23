import React, {Component} from 'react';
import Menu from "./MenuComponent";
import Home from "./HomeComponent";
import DishDetail from "./DishdetailComponent";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import {Switch, Route, Redirect, withRouter} from "react-router-dom";
import Contact from "./ContactComponent";
import About from "./AboutComponent";
import People from "./PeopleComponent";
import {connect} from 'react-redux';
import { addComment, fetchDishes } from "../redux/ActionCreators";


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
};


const mapDispatchToProps = (dispatch) => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => { dispatch(fetchDishes())}
});

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchDishes();
    }

    render() {
        const HomePage = () => {
            return (
                <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                      leader={this.props.leaders.filter((leaders) => leaders.featured)[0]}
                      dishesLoading = {this.props.dishes.isLoading}
                      dishesErrMess  = {this.props.dishes.errMess}
                      promotion={this.props.promotions.filter((promotions) => promotions.featured)[0]}/>
            );
        };

        const DishWithId = ({match}) => {
            return (
                <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                            dishesLoading = {this.props.dishes.isLoading}
                            ErrMess  = {this.props.dishes.errMess}
                            comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
                            addComment = {this.props.addComment}
                />
            );
        };

        const PeopleWithId = () => {
            return (
                <People leader={this.props.leaders.filter((leader) => leader.id)[0]}/>
            );
        };


        return (
            <>
                <Header/>
                <Switch>
                    <Route path="/home" component={HomePage}/>
                    <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes}/>}/>
                    <Route path="/menu/:dishId" component={DishWithId}/>
                    <Route exact path="/contactus" component={Contact}/>
                    <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders}/>}/>
                    <Route path="/aboutus/:id" component={PeopleWithId}/>
                    <Redirect to="/home"/>
                </Switch>
                <Footer/>
            </>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
