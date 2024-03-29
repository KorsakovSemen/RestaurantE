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
import {fetchDishes, ratingUp, fetchComments, fetchPromos, fetchLeaders, postComment, postLeaders} from "../redux/ActionCreators";
import {actions} from 'react-redux-form';
import {TransitionGroup, CSSTransition} from 'react-transition-group';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
};


const mapDispatchToProps = (dispatch) => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    postLeaders: (leadersId, name, abbr, description) => dispatch(postLeaders(leadersId, name, abbr, description)),
    fetchDishes: () => {
        dispatch(fetchDishes())
    },
    fetchLeaders: () => {
        dispatch(fetchLeaders())
    },
    ratingUp: (rating) => dispatch(ratingUp(rating)),
    resetFeedbackForm: () => {
        dispatch(actions.reset('feedback'))
    },
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos())
});


class Main extends Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    render() {

        const HomePage = () => {
            return (
                <Home
                    dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishErrMess={this.props.dishes.errMess}
                    promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                    promoLoading={this.props.promotions.isLoading}
                    promoErrMess={this.props.promotions.errMess}
                    leadersLoading={this.props.leaders.isLoading}
                    leadersErrMess={this.props.leaders.errMess}
                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                />
            );
        };

        const DishWithId = ({match}) => {
            return (
                <DishDetail
                    dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                    isLoading={this.props.dishes.isLoading}
                    errMess={this.props.dishes.errMess}
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}
                />
            );
        };

        const PeopleWithId = () => {
            return (
                <People leader={this.props.leaders.leaders.filter((leader) => leader.id)[0]}/>
            );
        };


        return (
            <>
                <Header/>
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                    <Switch>
                        <Route path="/home" component={HomePage}/>
                        <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes}/>}/>
                        <Route path="/menu/:dishId" component={DishWithId}/>
                        <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
                        <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders.leaders}  postLeaders={this.props.postLeaders}   leadersLoading={this.props.leaders.isLoading} leadersErrMess={this.props.leaders.errMess}/>}/>
                        <Route path="/aboutus/:id" component={PeopleWithId}/>
                        <Redirect to="/home"/>
                    </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer/>
            </>
        );

    }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
