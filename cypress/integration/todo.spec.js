it("should render todo items", () => {
    const todos = [
        {
            id: 1,
            text: "Have Breakfast",
            completed: true
        },
        {
            id: 2,
            text: "Have Lunch",
            completed: false
        }
    ];

    cy.server();
    cy.route("/todos", todos); // /todos GET 요청의 응답값을 변경한다.
    cy.visit("/All"); // 실제 로컬 서버의 주소에 접속한다.

    cy.get("[data-testid=todo-item]").within(items => {
        expect(items).to.have.length(2);
        expect(items[0]).to.contain("Have Breakfast");
        expect(items[0]).to.have.class("completed");

        expect(items[1]).to.contain("Have Lunch");
        expect(items[1]).not.to.have.class("completed");
    });
});


