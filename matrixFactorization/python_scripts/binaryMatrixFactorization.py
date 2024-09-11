import numpy as np
import pickle

class BMF:
    def __init__(self, R, A, K, lr, reg_param, epochs, tol=0.001):
        self.R = np.array(R) # Relations array (user-item relations)
        self.A = np.array(A)  # Adjacency matrix between users
        self.n_users, self.n_items = self.R.shape # users x jobs
        self.K = K # Number of latent features
        self.lr = lr # Learning rate
        self.reg_param = reg_param  # Regularization parameter
        self.epochs = epochs    # Number of epochs (for training)
        self.tol = tol
        np.random.seed(404)

        # R=MxN, U=MxK, V=KxN
        self.U = np.random.normal(scale=1./self.K, size=(self.n_users, self.K))
        self.V = np.random.normal(scale=1./self.K, size=(self.n_items, self.K))

        # self.U = np.random.uniform(low=0.1, high=1.0, size=(self.n_users, self.K))
        # self.V = np.random.uniform(low=0.1, high=1.0, size=(self.n_items, self.K))

        # self.U = np.random.normal(size=(self.n_users, self.K))
        # self.V = np.random.normal(size=(self.n_items, self.K))

        print("Matrix factorization initialized")
        self.print()

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def print(self):
        print(f"R = users {self.n_users} x {self.n_items} items")
        print(f"Number of latent features: {self.K}")
        print(f"Learning rate: {self.lr}")
        print(f"Number of iterations: {self.epochs}")
    
    def train(self):
        """ Stochastic Gradient Descent and update based on adjacency matrix """

        print("training")
        for epoch in range(self.epochs):
            for i in range(self.n_users):
                for j in range(self.n_items):
                    if self.R[i, j] > 0:  # Εξετάζουμε μόνο τα υπάρχοντα interactions (1s)
                        prediction = self.predict_single(i, j)
                        error = self.R[i, j] - prediction

                        # Ενημέρωση των U και V μέσω SGD
                        self.U[i, :] += self.lr * (error * self.V[j, :] - self.reg_param * self.U[i, :])
                        self.V[j, :] += self.lr * (error * self.U[i, :] - self.reg_param * self.V[j, :])
            
            # Ενημέρωση βάσει του πίνακα γειτνίασης A (συνδεδεμένοι χρήστες)
            for i in range(self.n_users):
                for j in range(i + 1, self.n_users):
                    if self.A[i, j] == 1:  # Αν οι χρήστες είναι συνδεδεμένοι
                        # Οι συνδεδεμένοι χρήστες επηρεάζουν ο ένας τον άλλο
                        self.U[i] += self.lr * (self.U[j] - self.U[i])
                        self.U[j] += self.lr * (self.U[i] - self.U[j])

            # Υπολογισμός σφάλματος για τη συγκεκριμένη εποχή (προαιρετικά για αξιολόγηση)
            mse = self.mse()
            print(mse)
            if mse < self.tol:
                break

            if (epoch + 1) % 100 == 0:
                print(f'Epoch: {epoch+1}, MSE: {mse}')

    def predict_single(self, user_id, job_id):
        """ Predicted array for a single user-job couple. """
        dot_product = np.dot(self.U[user_id, :], self.V[job_id, :])
        return self.sigmoid(dot_product)
    
    def mse(self):
        """ Mean Squared Error """
        predicted = self.full_matrix()
        error = 0
        for i in range(self.n_users):
            for j in range(self.n_items):
                if self.R[i, j] > 0:
                    error += (self.R[i, j] - predicted[i, j]) ** 2
        return error / np.count_nonzero(self.R)
    
    def full_matrix(self):
        """ Predicted array for all users and jobs. """
        full_pred = np.dot(self.U, self.V.T)
        return self.sigmoid(full_pred)

    def recommend(self, user_index, top_n=10):
        """ Recommends jobs to a user based on his interactions and his network's interactions """
        predictions = self.full_matrix()[user_index, :]
        
        # Προτεραιότητα στα unseen jobs
        seen_jobs = self.R[user_index, :] > 0  # Boolean array (True για τα jobs που έχει δει)
        predictions[seen_jobs] = predictions[seen_jobs] - 5  # Αφαιρούμε τις seen jobs βάζοντας τις προβλέψεις στο -άπειρο
        
        # Ταξινόμηση των jobs βάσει των προβλέψεων (φθίνουσα σειρά)
        job_ids = np.argsort(-predictions)
        
        return job_ids[:top_n]

    def save(self, path):
        with open(path + ".pkl", "wb") as file:
            pickle.dump(self, file)
        print(f"Object saved to {path}")
    
    @staticmethod
    def load(filename):
        with open(filename + ".pkl", "rb") as file:
            print(f"Object loaded successfuly from {filename + "pkl"}")
            return pickle.load(file)

