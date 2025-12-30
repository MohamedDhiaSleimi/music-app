package iset.tn.mobile_frontend.ui.register

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import iset.tn.mobile_frontend.data.model.requests.RegisterRequest
import iset.tn.mobile_frontend.data.network.RetrofitInstance
import iset.tn.mobile_frontend.databinding.FragmentRegisterBinding
import iset.tn.mobile_frontend.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RegisterFragment : Fragment() {

    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnBack.setOnClickListener {
            requireActivity().onBackPressed()
        }

        binding.btnRegister.setOnClickListener {
            registerUser()
        }
    }

    private fun registerUser() {
        val email = binding.etEmail.text.toString()
        val username = binding.etUsername.text.toString()
        val password = binding.etPassword.text.toString()

        // Basic validation
        if (!isFormValid(email, username, password)) {
            return
        }

        val request = RegisterRequest(
            email = email,
            username = username,
            password = password
        )

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitInstance.authApi.register(request)
                CoroutineScope(Dispatchers.Main).launch {
                    if (response.isSuccessful) {
                        Toast.makeText(requireContext(), "Registration successful!", Toast.LENGTH_SHORT).show()
                        findNavController().navigate(R.id.action_register_to_login)
                        clearForm()
                    } else {
                        val errorBody = response.errorBody()?.string()
                        showError("Error ${response.code()}: $errorBody")
                    }
                }
            } catch (e: Exception) {
                CoroutineScope(Dispatchers.Main).launch {
                    showError("Exception: ${e.message}")
                }
            }
        }
    }

    private fun isFormValid(email: String, username: String, password: String): Boolean {
        // Validate email
        if (email.isBlank() || !email.contains("@")) {
            showError("Please enter a valid email address")
            return false
        }

        // Validate username
        if (username.length < 3 || username.length > 20) {
            showError("Username must be between 3 and 20 characters")
            return false
        }

        // Validate password
        if (password.length < 6) {
            showError("Password must be at least 6 characters")
            return false
        }

        hideError()
        return true
    }

    private fun showError(message: String) {
        binding.textError.text = message
        binding.textError.visibility = View.VISIBLE
    }

    private fun hideError() {
        binding.textError.visibility = View.GONE
    }

    private fun clearForm() {
        binding.etEmail.text?.clear()
        binding.etUsername.text?.clear()
        binding.etPassword.text?.clear()
        hideError()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}