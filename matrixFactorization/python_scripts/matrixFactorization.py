import numpy as np

class MF:
    """ 
        Factorize matrix R into two lower rank matrices U and V, such that their product approximates R
        U: represents the user's preferences
        V: represents the item's characteristics
    """
    # Constructor
    def __init__(self, R : dict, K=10, lr=0.01, alpha=0.01, n_iter=1, e_threshold=0.01):
        self.R = R # Relations array (user-item relations)
        self.n_users = len(R)
        self.n_items = len(next(iter(R.values())))
        if self.n_users <= 0 or self.n_items <= 0:
            print("Error: number of users/items is not valid")
            return
        self.K = K # Number of latent features
        self.lr = lr # Learning rate
        self.alpha = alpha # Regularization parameter
        self.n_iter = n_iter # Number of iterations (for training)
        self.e_threshold = e_threshold # Error threshold

    # Training function
    def train(self):
        print("Starting training routine")

        U = np.random.rand(self.n_users, self.K)
        V = np.random.rand(self.n_items, self.K)

        for iter in range(self.n_iter):
            for user_id, user_items_dict in self.R.items():
                for item_id, rating in user_items_dict.items():
                    # print(f"User ID: {user_id}, Item ID: {item_id}, Rating: {rating}")
                    if rating > 0:
                        print("test")

    # Error function
    def error(self, userId, itemId):
        print("Calculating error")
        
        return 0
    
    # Prediction function
    def predict(self, userId, itemId):
        return 0












    # # Gradient Descent
    # def train_matrix_factorization(R, U, V, alpha, lambda_, epochs):
    #     for epoch in range(epochs):
    #         for i in range(len(R)):
    #             for j in range(len(R[i])):
    #                 if R[i][j] > 0:  # Υπολογίζουμε σφάλμα μόνο για μη μηδενικά στοιχεία
    #                     eij = R[i][j] - np.dot(U[i, :], V[j, :].T)
    #                     U[i, :] += alpha * (2 * eij * V[j, :] - lambda_ * U[i, :])
    #                     V[j, :] += alpha * (2 * eij * U[i, :] - lambda_ * V[j, :])
    #         cost = compute_cost(R, U, V, lambda_)
    #         print(f'Epoch {epoch+1}/{epochs}, Cost: {cost}')
    #     return U, V

    # # Εκπαίδευση του μοντέλου
    # lr = 0.01   # Learning rate
    # lambda_ = 0.1  # Regularization factor
    # epochs = 1000


































# # Αρχικοποίηση παραμέτρων
# n_users = 100  # Αριθμός χρηστών
# n_jobs = 50    # Αριθμός αγγελιών
# n_factors = 10 # Αριθμός κρυφών παραγόντων

# # Αρχικοποίηση τυχαίων πινάκων U και V
# U = np.random.rand(n_users, n_factors)
# V = np.random.rand(n_jobs, n_factors)

# # Συνάρτηση κόστους MSE (Mean Squared Error)
# def compute_cost(R, U, V, lambda_):
#     predicted = np.dot(U, V.T)
#     error = (R - predicted) ** 2
#     cost = np.sum(error)
#     # Regularization
#     cost += lambda_ * (np.sum(np.square(U)) + np.sum(np.square(V)))
#     return cost

# # Gradient Descent
# def train_matrix_factorization(R, U, V, alpha, lambda_, epochs):
#     for epoch in range(epochs):
#         for i in range(len(R)):
#             for j in range(len(R[i])):
#                 if R[i][j] > 0:  # Υπολογίζουμε σφάλμα μόνο για μη μηδενικά στοιχεία
#                     eij = R[i][j] - np.dot(U[i, :], V[j, :].T)
#                     U[i, :] += alpha * (2 * eij * V[j, :] - lambda_ * U[i, :])
#                     V[j, :] += alpha * (2 * eij * U[i, :] - lambda_ * V[j, :])
#         cost = compute_cost(R, U, V, lambda_)
#         print(f'Epoch {epoch+1}/{epochs}, Cost: {cost}')
#     return U, V

# # Εκπαίδευση του μοντέλου
# lr = 0.01   # Learning rate
# lambda_ = 0.1  # Regularization factor
# epochs = 1000

# R = np.random.randint(0, 2, (n_users, n_jobs))  # Τυχαίος πίνακας αλληλεπιδράσεων
# U, V = train_matrix_factorization(R, U, V, alpha, lambda_, epochs)

# # Προβλέψεις
# predicted_ratings = np.dot(U, V.T)
