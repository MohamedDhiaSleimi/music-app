package iset.tn.mobile_frontend.ui.login

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import iset.tn.mobile_frontend.databinding.FragmentLoginBinding
import iset.tn.mobile_frontend.ui.viewmodel.AuthViewModel
import iset.tn.mobile_frontend.R
class LoginFragment : Fragment() {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!
    private val vm: AuthViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        vm.setSessionManager(requireContext())

        binding.btnLogin.setOnClickListener {
            val email = binding.inputEmail.text.toString()
            val password = binding.inputPassword.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                binding.textError.text = "Please fill in all fields"
                binding.textError.visibility = View.VISIBLE
            } else {
                binding.textError.visibility = View.GONE
                vm.login(email, password)
            }
        }

        binding.btnBack.setOnClickListener {
            findNavController().navigateUp()
        }

        binding.btnRegister.setOnClickListener {
            findNavController().navigate(R.id.action_login_to_register)
        }

        observeLiveData()
    }

    private fun observeLiveData() {
        vm.authResult.observe(viewLifecycleOwner) { auth ->
            if (auth != null) {
                Toast.makeText(requireContext(), "Login successful!", Toast.LENGTH_SHORT).show()
                // Navigate to music screen
                findNavController().navigate(R.id.action_login_to_music)
            }
        }

        vm.errorMessage.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                binding.textError.text = error
                binding.textError.visibility = View.VISIBLE
            } else {
                binding.textError.visibility = View.GONE
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}