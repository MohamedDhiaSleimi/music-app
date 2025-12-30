package iset.tn.mobile_frontend.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import iset.tn.mobile_frontend.R
import iset.tn.mobile_frontend.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupClickListeners()
        setupAnimations()
    }

    private fun setupClickListeners() {
        // ✅ CORRECTION : Utiliser navigate() avec ID directement
        binding.btnLogin.setOnClickListener {
            animateButtonClick(binding.btnLogin) {
                findNavController().navigate(R.id.loginFragment)
            }
        }

        // ✅ CORRECTION : Utiliser navigate() avec ID directement
        binding.btnRegister.setOnClickListener {
            animateButtonClick(binding.btnRegister) {
                findNavController().navigate(R.id.registerFragment)
            }
        }


    }

    private fun setupAnimations() {
        // Animation d'entrée pour les éléments
        binding.logo.animate().alpha(1f).setDuration(800).start()
        binding.tvWelcome.animate().alpha(1f).setStartDelay(200).setDuration(600).start()
        binding.tvAppName.animate().alpha(1f).setStartDelay(400).setDuration(600).start()
        binding.tvTagline.animate().alpha(1f).setStartDelay(600).setDuration(600).start()

        // Animation des boutons
        binding.btnLogin.animate().alpha(1f).setStartDelay(800).setDuration(400).start()
        binding.btnRegister.animate().alpha(1f).setStartDelay(900).setDuration(400).start()
    }

    private fun animateButtonClick(button: View, action: () -> Unit) {
        button.animate().scaleX(0.95f).scaleY(0.95f).setDuration(100).withEndAction {
            button.animate().scaleX(1f).scaleY(1f).setDuration(100).withEndAction(action).start()
        }.start()
    }

    private fun animateTextClick(textView: View, action: () -> Unit) {
        textView.animate().alpha(0.6f).setDuration(100).withEndAction {
            textView.animate().alpha(1f).setDuration(100).withEndAction(action).start()
        }.start()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}