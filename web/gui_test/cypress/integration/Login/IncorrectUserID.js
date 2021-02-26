import {address, invalid_login} from '../../util/constant';

describe("Incorrect userID", () =>{
    it("Login to the website", ()=>{
        const userID          = "abc123";
        const userPassword    = "lab1321bal";

        cy.visit(address);
        cy.login(userID, userPassword);
    });

    it("Assert Feedback", () =>{
        const feedbackPath    = '//span[@class="kc-feedback-text"]';

        cy.xpath(feedbackPath).should(($el) =>{
            expect($el).to.have.text(invalid_login);
        });
    });
})
